import { Components } from '@formio/js';
const ParentComponent = (Components as any).components.datagrid;
const NestedComponent = (Components as any).components.nested;
import editForm from './Component.form';

import { Constants } from '../Common/Constants';

const ID = 'simpleranking';
const DISPLAY = 'Ranking';
const DEFAULT_DESCRIPTION = 'Please rank each item by selecting a unique number for each.';

export default class Component extends (ParentComponent as any) {
    static schema(...extend) {
        return ParentComponent.schema(
            {
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
                    components: false, // disable editing sub-components in builder
                },
                errors: {
                    required: Constants.DEFAULT_REQUIRED_VALIDATION_MESSAGE,
                },
                validate: {
                    custom: ``,
                },
            },
            ...extend
        );
    }

    public static editForm = editForm;

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


    /**
     * Shuffle array using Fisher-Yates algorithm
     */
    private shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    init() {
        const statements = this.component.statements || [];
        const statementCount = statements.length;

        // Use persistent IDs when present, fallback to generating for legacy data
        const statementsWithIds = statements.map((stmt, index) => ({
            ...stmt,
            id: stmt.id || `stmt_${Math.random().toString(36).substr(2, 9)}`,
        }));

        const orderedStatements = this.component.randomizeOrder
            ? this.shuffleArray(statementsWithIds)
            : statementsWithIds;

        const rankOptions = Array.from({ length: statementCount }, (_, i) => ({
            label: String(i + 1),
            value: i + 1,
        }));

        this.component.components = [
            {
                label: 'Statement ID',
                key: 'statementId',
                type: 'hidden',
                input: true,
                persistent: true,
            },
            {
                label: 'Statement',
                key: 'statementDisplay',
                type: 'content',
                input: false,
                html: '{{row.statement}}',
                hideLabel: true,
                persistent: false,
                ignore: this.builderMode,
                builderDisabled: true
            },
            {
                label: 'Rank',
                key: 'rank',
                type: 'select',
                input: true,
                dataSrc: 'values',
                data: { values: rankOptions },
                validate: {
                    required: this.component.validate?.required || false,
                },
                hideLabel: true,
                builderDisabled: true
            }
        ];

        this.component.defaultValue = orderedStatements.map((stmt) => ({
            statementId: stmt.id,
            statement: stmt.label,
            rank: '',
        }));

        // Preserves user input when statements are reordered or relabelled.
        const existingRows: Array<{ statementId?: string; rank?: any }> =
            Array.isArray(this.dataValue) ? this.dataValue : [];
        const existingRankById: Record<string, any> = {};
        for (const row of existingRows) {
            if (row.statementId) existingRankById[row.statementId] = row.rank;
        }
        this.dataValue = orderedStatements.map((stmt) => ({
            statementId: stmt.id,
            statement: stmt.label,
            rank: existingRankById[stmt.id] ?? '',
        }));

        super.init();
    }

    // Access the grandparent's render
    get grandparentRender() {
        return NestedComponent.prototype.render;
    }

     render(children) {
        if (this.builderMode) {
            const statements = this.component.statements || [];
            
            // Show preview in builder to match other components and to prevent 'drag and drop' options
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
            
            // Use grandparent's render to get builder wrapper with edit controls
            return this.grandparentRender.call(this, previewHtml);
        }
        return super.render(children);
    }

    attach(element) {
        const attached = super.attach(element);
        
        // Add change listener to check duplicates only (real-time feedback)
        this.on('change', () => {
            this.checkDuplicateRanks();
        });
        
        return attached;
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

    // Check for duplicate ranks, returns true if duplicates exist
    checkDuplicateRanks(): boolean {
        const rows = this.dataValue || [];
        const ranks = rows.map(row => row.rank).filter(r => r !== undefined && r !== null && r !== '');
        
        // Check for duplicates in data (independent of DOM)
        let hasDuplicates = false;
        const seenRanks = new Set();
        for (const rank of ranks) {
            if (seenRanks.has(rank)) {
                hasDuplicates = true;
                break;
            }
            seenRanks.add(rank);
        }
        
        // Update DOM styling if element exists (optional visual feedback)
        const selects = this.element?.querySelectorAll('select');
        if (selects) {
            selects.forEach((select, index) => {
                const row = rows[index];
                if (!row) return;
                
                const currentRank = row.rank;
                const cell = select.closest('td') || select.closest('.form-group');
                
                // Check if this specific rank is duplicated
                let isDuplicate = false;
                if (currentRank !== undefined && currentRank !== null && currentRank !== '') {
                    const count = ranks.filter(r => r === currentRank).length;
                    isDuplicate = count > 1;
                }
                
                // Toggle error styling
                if (isDuplicate) {
                    select.classList.add('is-invalid');
                    let errorDiv = cell?.querySelector('.duplicate-error');
                    if (!errorDiv && cell) {
                        errorDiv = document.createElement('div');
                        errorDiv.className = 'duplicate-error form-text text-danger';
                        errorDiv.textContent = 'This ranking is already used.';
                        cell.appendChild(errorDiv);
                    }
                } else {
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

    // Check for partial fill (some filled, not all), returns true if partial fill exists
    checkPartialFill(): boolean {
        const rows = this.dataValue || [];
        const ranks = rows.map(row => row.rank).filter(r => r !== undefined && r !== null && r !== '');
        
        const filledCount = ranks.length;
        const totalCount = rows.length;
        return filledCount > 0 && filledCount < totalCount;
    }

}
