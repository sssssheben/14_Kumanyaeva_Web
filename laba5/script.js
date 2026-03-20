class Card {
    constructor(id, name, role, stats, ability, color, art, type) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.stats = stats;
        this.ability = ability;
        this.color = color;
        this.art = art;
        this.type = type;
    }

    getHTML(isEdit) {
        const statsHtml = Object.entries(this.stats).map(([key, val]) => `
            <div class="stat-row">
                ${key}: 
                ${isEdit 
                    ? `<input class="edit-input stat-input" value="${val}" onchange="app.updateStat(${this.id}, '${key}', this.value)">` 
                    : `<span>${val}</span>`}
            </div>
        `).join('');

        return `
            <div class="card-outer" style="background-color: ${this.color}">
                <div class="card-inner">
                    ${isEdit ? `<button class="btn-delete" onclick="app.deleteCard(${this.id})">×</button>` : ''}
                    
                    <div class="card-header">
                        ${isEdit 
                            ? `<input class="edit-input name-input" value="${this.name}" onchange="app.updateField(${this.id}, 'name', this.value)">`
                            : `<h2 class="card-name">${this.name}</h2>`}
                        
                        ${isEdit 
                            ? `<select class="edit-select" onchange="app.changeType(${this.id}, this.value)">
                                <option value="lekar" ${this.type === 'lekar' ? 'selected' : ''}>лекаръ</option>
                                <option value="silach" ${this.type === 'silach' ? 'selected' : ''}>силачъ</option>
                                <option value="vedun" ${this.type === 'vedun' ? 'selected' : ''}>ведунъ</option>
                               </select>`
                            : `<span class="card-role">${this.role}</span>`}
                    </div>

                    <div class="card-stats">${statsHtml}</div>

                    <div class="ability-badge">
                        <span class="ability-label">Деяния:</span>
                        <div class="ability-text">
                            ${isEdit 
                                ? `<textarea class="edit-input ability-edit" onchange="app.updateField(${this.id}, 'ability', this.value)">${this.ability}</textarea>`
                                : this.ability}
                        </div>
                    </div>

                    <div class="char-art" style="background-image: url('${this.art}')"></div>
                </div>
            </div>
        `;
    }
}

class Lekar extends Card {
    constructor(id, name, stats, ability) {
        super(id, name, "лекаръ", stats, ability, "#c5a059", "сискиженщина1.png", "lekar");
    }
}

class Silach extends Card {
    constructor(id, name, stats, ability) {
        super(id, name, "силачъ", stats, ability, "#8b1a1a", "сискимужчина1.png", "silach");
    }
}

class Vedun extends Card {
    constructor(id, name, stats, ability) {
        super(id, name, "ведунъ", stats, ability, "#1a748b", "безсискидед.png", "vedun");
    }
}

const app = {
    cards: [],
    isEdit: false,

    init() {
        const saved = localStorage.getItem('slav_deck_v4');
        if (saved) {
            const data = JSON.parse(saved);
            this.cards = data.map(c => this.createInstance(c.type, c.id, c.name, c.stats, c.ability));
        } else {
            this.cards = [
                new Lekar(1, "ЛЮБАВА", { лета: 16, живостъ: 50, крепостъ: 20, мощъ: 10, увертливостъ: 60 }, "Въ одночасье молоком лечить молодцевъ"),
                new Silach(2, "ИЛЬЯ", { лета: 21, живостъ: 70, крепостъ: 50, мощъ: 50, увертливостъ: 45 }, "Богатырской силою душитъ ящеровъ"),
                new Vedun(3, "ТИХОН", { лета: 65, живостъ: 40, крепостъ: 20, мощъ: 10, увертливостъ: 40 }, "Мудростъ старческая разятъ ящеровъ")
            ];
        }
        this.renderSite();
    },

    createInstance(type, id, name, stats, ability) {
        if (type === "silach") return new Silach(id, name, stats, ability);
        if (type === "vedun") return new Vedun(id, name, stats, ability);
        return new Lekar(id, name, stats, ability);
    },

    changeType(id, newType) {
        const index = this.cards.findIndex(c => c.id === id);
        const old = this.cards[index];
        this.cards[index] = this.createInstance(newType, id, old.name, old.stats, old.ability);
        this.renderSite();
    },

    renderSite() {
        document.body.innerHTML = "";
        const header = document.createElement('header');
        header.innerHTML = `
            <div class="header-banner"><h1>КОЛОДА КАРТЪ ДЛЯ ИГРЫ "РУСЫ ПРОТИВ ЯЩЕРОВЪ"</h1></div>
            <button class="edit-mode-btn" onclick="app.toggleEdit()">${this.isEdit ? 'СОХРАНИТЪ' : 'редактироватъ'}</button>
        `;
        const container = document.createElement('div');
        container.id = "main-deck";
        this.cards.forEach(card => {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = card.getHTML(this.isEdit);
            container.appendChild(wrapper.firstElementChild);
        });
        if (this.isEdit) {
            const addBox = document.createElement('div');
            addBox.className = "add-card-container";
            addBox.innerHTML = `<div class="add-btn-circle" onclick="app.addCard()">+</div><div style="font-size:24px; color:#444;">ПРИЗВАТЪ ВИТЯЗЯ</div>`;
            container.appendChild(addBox);
        }
        document.body.append(header, container);
    },

    toggleEdit() {
        this.isEdit = !this.isEdit;
        if (!this.isEdit) localStorage.setItem('slav_deck_v4', JSON.stringify(this.cards));
        this.renderSite();
    },

    addCard() {
        const id = Date.now();
        const defStats = { лета: 18, живостъ: 10, крепостъ: 10, мощъ: 10, увертливостъ: 10 };
        this.cards.push(new Lekar(id, "НОВЫЙ ГЕРОЙ", defStats, "Описанье подвига..."));
        this.renderSite();
    },

    deleteCard(id) {
        if (confirm("Изгнатъ?")) { this.cards = this.cards.filter(c => c.id !== id); this.renderSite(); }
    },

    updateField(id, field, val) { const c = this.cards.find(x => x.id === id); if (c) c[field] = val; },
    updateStat(id, key, val) { const c = this.cards.find(x => x.id === id); if (c) c.stats[key] = val; }
};

app.init();