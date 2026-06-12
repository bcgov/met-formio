import { Components } from '@formio/js';
import editForm from './Component.form';
import { Constants } from '../Common/Constants';
const ID = 'simpleranking';
const DISPLAY = 'Ranking';
const DEFAULT_DESCRIPTION = 'Please rank each item by selecting a unique number for each.';
export default function createSimpleRanking() {
    const ParentComponent = Components.components.datagrid;
    const NestedComponent = Components.components.nested;
    class Component extends ParentComponent {
        static schema(...extend) {
            return ParentComponent.schema({
                type: ID,
                label: DISPLAY,
                key: ID,
                description: DEFAULT_DESCRIPTION,
                customClass: 'simpleranking-no-header',
                reorder: false,
                disableAddingRemovingRows: true,
                tableView: false,
                enableRowGroups: false,
                initEmpty: false,
                addAnother: '',
                addAnotherPosition: 'bottom',
                layoutFixed: true,
                statements: [
                    { id: 'stmt_default1', label: 'Statement 1' },
                    { id: 'stmt_default2', label: 'Statement 2' },
                    { id: 'stmt_default3', label: 'Statement 3' },
                ],
                randomizeOrder: false,
                input: true,
                noDragDrop: true,
                builder: {
                    components: false,
                },
                errors: {
                    required: Constants.DEFAULT_REQUIRED_VALIDATION_MESSAGE,
                },
                validate: {
                    custom: ``,
                },
            }, ...extend);
        }
        static get builderInfo() {
            return {
                title: DISPLAY,
                group: 'simple',
                icon: 'sort-numeric-asc',
                weight: 37,
                documentation: Constants.DEFAULT_HELP_LINK,
                showPreview: true,
                schema: Component.schema(),
            };
        }
        get noDragDrop() {
            return true;
        }
        shuffleArray(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }
        init() {
            const statements = this.component.statements || [];
            const statementsWithIds = statements.map((stmt) => ({
                ...stmt,
                id: stmt.id || `stmt_${Math.random().toString(36).substr(2, 9)}`,
            }));
            const orderedStatements = this.component.randomizeOrder
                ? this.shuffleArray(statementsWithIds)
                : statementsWithIds;
            // Only hidden components — rank select is rendered manually to avoid
            // formio's async setItems pipeline causing stale display on page navigation.
            this.component.components = [
                {
                    label: 'Statement ID',
                    key: 'statementId',
                    type: 'hidden',
                    input: true,
                    persistent: true,
                },
                {
                    label: 'Rank',
                    key: 'rank',
                    type: 'hidden',
                    input: true,
                    persistent: true,
                },
            ];
            this.component.defaultValue = orderedStatements.map((stmt) => ({
                statementId: stmt.id,
                statement: stmt.label,
                rank: '',
            }));
            const existingRows = Array.isArray(this.dataValue) ? this.dataValue : [];
            const existingRankById = {};
            for (const row of existingRows) {
                if (row.statementId)
                    existingRankById[row.statementId] = row.rank;
            }
            this.dataValue = orderedStatements.map((stmt) => ({
                statementId: stmt.id,
                statement: stmt.label,
                rank: existingRankById[stmt.id] ?? '',
            }));
            super.init();
        }
        get grandparentRender() {
            return NestedComponent.prototype.render;
        }
        get grandparentAttach() {
            return NestedComponent.prototype.attach;
        }
        render(children) {
            const statements = this.component.statements || [];
            if (this.builderMode) {
                const previewHtml = `
                <table class="table datagrid-table table-bordered simpleranking-no-header">
                    <tbody>
                        ${statements.map((stmt) => `
                            <tr>
                                <td>${stmt.label}</td>
                                <td>
                                    <select class="form-control form-select" disabled>
                                        <option value=""></option>
                                        ${statements.map((_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
                                    </select>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
                return this.grandparentRender.call(this, previewHtml);
            }
            const rows = Array.isArray(this.dataValue) ? this.dataValue : [];
            const count = rows.length;
            const isDisabled = this.disabled || this.options?.readOnly;
            const tableHtml = `
            <table class="table datagrid-table table-bordered simpleranking-no-header">
                <tbody>
                    ${rows.map((row, i) => `
                        <tr>
                            <td>${row.statement || ''}</td>
                            <td>
                                <select
                                    class="form-control form-select"
                                    data-row-index="${i}"
                                    ${isDisabled ? 'disabled' : ''}
                                >
                                    <option value=""></option>
                                    ${Array.from({ length: count }, (_, n) => {
                const val = String(n + 1);
                const selected = String(row.rank) === val ? ' selected="selected"' : '';
                return `<option value="${val}"${selected}>${val}</option>`;
            }).join('')}
                                </select>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
            return this.grandparentRender.call(this, tableHtml);
        }
        attach(element) {
            // Use NestedComponent's attach (not DataGrid's) to set up this.element and
            // base lifecycle without DataGrid trying to wire up formio select components.
            const result = this.grandparentAttach.call(this, element);
            const selects = this.element?.querySelectorAll('select[data-row-index]');
            selects?.forEach((select) => {
                const rowIndex = parseInt(select.getAttribute('data-row-index') || '0', 10);
                this.addEventListener(select, 'change', () => {
                    const rows = this.dataValue || [];
                    if (rows[rowIndex]) {
                        rows[rowIndex].rank = select.value;
                        this.dataValue = rows;
                        this.triggerChange();
                    }
                    this.checkDuplicateRanks();
                });
            });
            this.on('change', () => {
                this.checkDuplicateRanks();
            });
            return result;
        }
        checkValidity(data, dirty, rowData) {
            const isValid = super.checkValidity(data, dirty, rowData);
            const hasDuplicates = this.checkDuplicateRanks();
            const hasPartialFill = this.checkPartialFill();
            if (hasDuplicates) {
                this.setCustomValidity('Each ranking can only be used once.', dirty);
                return false;
            }
            if (hasPartialFill) {
                this.setCustomValidity('Please rank all items or leave all blank.', dirty);
                return false;
            }
            if (!isValid) {
                return false;
            }
            this.setCustomValidity('', dirty);
            return true;
        }
        checkDuplicateRanks() {
            const rows = this.dataValue || [];
            const ranks = rows.map(row => row.rank).filter(r => r !== undefined && r !== null && r !== '');
            let hasDuplicates = false;
            const seenRanks = new Set();
            for (const rank of ranks) {
                if (seenRanks.has(rank)) {
                    hasDuplicates = true;
                    break;
                }
                seenRanks.add(rank);
            }
            const selects = this.element?.querySelectorAll('select[data-row-index]');
            if (selects) {
                selects.forEach((select, index) => {
                    const row = rows[index];
                    if (!row)
                        return;
                    const currentRank = row.rank;
                    const cell = select.closest('td') || select.closest('.form-group');
                    let isDuplicate = false;
                    if (currentRank !== undefined && currentRank !== null && currentRank !== '') {
                        const count = ranks.filter(r => r === currentRank).length;
                        isDuplicate = count > 1;
                    }
                    if (isDuplicate) {
                        select.classList.add('is-invalid');
                        let errorDiv = cell?.querySelector('.duplicate-error');
                        if (!errorDiv && cell) {
                            errorDiv = document.createElement('div');
                            errorDiv.className = 'duplicate-error form-text text-danger';
                            errorDiv.textContent = 'This ranking is already used.';
                            cell.appendChild(errorDiv);
                        }
                    }
                    else {
                        select.classList.remove('is-invalid');
                        const errorDiv = cell?.querySelector('.duplicate-error');
                        if (errorDiv) {
                            errorDiv.remove();
                        }
                    }
                });
            }
            return hasDuplicates;
        }
        checkPartialFill() {
            const rows = this.dataValue || [];
            const ranks = rows.map(row => row.rank).filter(r => r !== undefined && r !== null && r !== '');
            const filledCount = ranks.length;
            const totalCount = rows.length;
            return filledCount > 0 && filledCount < totalCount;
        }
    }
    Component.editForm = editForm;
    return Component;
}
