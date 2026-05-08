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
                reorder: false,
                disableAddingRemovingRows: true,
                tableView: false,
                enableRowGroups: false,
                initEmpty: false,
                addAnother: '',
                addAnotherPosition: 'bottom',
                layoutFixed: true,
                statements: [
                    { id: '1', label: 'Statement 1' },
                    { id: '2', label: 'Statement 2' },
                    { id: '3', label: 'Statement 3' },
                ],
                randomizeOrder: false,
                input: true,
                noDragDrop: true,
                builder: {
                    components: false, // disable editing sub-components in builder
                },
                validate: {
                    custom: `
                        var rows = input || [];
                        var ranks = [];
                        for (var i = 0; i < rows.length; i++) {
                            if (rows[i].rank !== undefined && rows[i].rank !== null && rows[i].rank !== '') {
                                if (ranks.indexOf(rows[i].rank) !== -1) {
                                    valid = 'Each ranking can only be used once.';
                                    break;
                                }
                                ranks.push(rows[i].rank);
                            }
                        }
                    `,
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

        // Add auto-generated IDs to statements
        const statementsWithIds = statements.map((stmt, index) => ({
            ...stmt,
            id: index + 1,  // Auto-generate: 1, 2, 3, etc.
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
                <table class="table datagrid-table table-bordered">
                    <thead>
                        <tr>
                            <th>Statement</th>
                            <th style="width: 100px;">Rank</th>
                        </tr>
                    </thead>
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
        
        // Add change listener to re-validate all rows
        this.on('change', () => {
            this.checkAllRows();
        });
        
        return attached;
    }

    // Check to prevent duplicate ranks and show error message
    checkAllRows() {
        const rows = this.dataValue || [];
        const ranks = rows.map(row => row.rank).filter(r => r !== undefined && r !== null && r !== '');
        
        // Find all select elements in this component
        const selects = this.element?.querySelectorAll('select');
        if (!selects) return;
        
        selects.forEach((select, index) => {
            const row = rows[index];
            if (!row) return;
            
            const currentRank = row.rank;
            const cell = select.closest('td') || select.closest('.form-group');
            
            // Check if this rank is duplicated
            let isDuplicate = false;
            if (currentRank !== undefined && currentRank !== null && currentRank !== '') {
                const count = ranks.filter(r => r === currentRank).length;
                isDuplicate = count > 1;
            }
            
            // Toggle error styling
            if (isDuplicate) {
                select.classList.add('is-invalid');
                // Add error message if not present
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

}
