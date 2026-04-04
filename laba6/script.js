const root = document.getElementById('app-root');

function renderLoader() {
    root.innerHTML = '<div class="loader"></div><p style="text-align:center">ищем лучшие кадры...</p>';
}


async function showCatalog() {
    renderLoader();
    try {
        const res = await fetch('https://api.tvmaze.com/search/shows?q=movie');
        const data = await res.json();
        
        let html = `
            <div class="container">
                <h1>оч крутые фильмы сейчас в прокате</h1>
                <div class="movie-grid">`;
        
        data.forEach(item => {
            const film = item.show;
            const poster = film.image ? film.image.medium : 'https://avatars.mds.yandex.net/i?id=2a00000179f09a4438539eb6673bbfba5c73-4479063-images-thumbs&n=13';
            
            html += `
                <div class="movie-card">
                    <img src="${poster}" alt="${film.name}">
                    <div class="movie-info">
                        <h4>${film.name}</h4>
                        <p>Рейтинг: ⭐ ${film.rating.average || '7.5'}</p>
                        <p style="font-size: 0.8em; color: #ccc;">${film.genres.join(', ')}</p>
                        <button class="btn btn-outline" onclick="addToWatchlist('${film.name}')">в закладки</button>
                    </div>
                </div>`;
        });
        
        html += `</div></div>`;
        root.innerHTML = html;
    } catch (e) { 
        root.innerHTML = "<div class='container'><h1>обшибка</h1></div>"; 
    }
}


function addToWatchlist(name) {
    alert(`Фильм "${name}" добавлен в ваш список!`);
}

async function showReviews() {
    renderLoader();
    try {
        const res = await fetch('https://dummyjson.com/posts?limit=3');
        const data = await res.json();

        root.innerHTML = `
            <div class="container">
                <h1>мои рецензии</h1>
                <div class="card" style="background:#3d1a10; padding:20px; margin-bottom:20px; border-radius:8px; border: 1px solid var(--accent);">
                    <h3>написать новую рецензию</h3>
                    <input type="text" id="revTitle" placeholder="название фильма..." style="width:100%; padding:10px; margin:10px 0; background: #1a0f0a; color: white; border: 1px solid #555;">
                    <button class="btn btn-primary" onclick="addReview()">опубликовать</button>
                </div>
                <div id="reviews-list"></div>
            </div>
        `;

        const list = document.getElementById('reviews-list');
        data.posts.forEach(post => {
            const div = document.createElement('div');
            div.className = 'movie-card';
            div.style = 'margin:10px 0; padding:15px; width: 100%; box-sizing: border-box;';
            div.id = `rev-${post.id}`;
            div.innerHTML = `
                <p style="color: var(--accent); font-size: 0.8em;">рецензия #${post.id}</p>
                <h3 id="t-${post.id}">${post.title}</h3>
                <button class="btn btn-outline" onclick="editReview(${post.id})">правка</button>
            `;
            list.appendChild(div);
        });
    } catch (e) { root.innerHTML = "обшибка"; }
}


async function addReview() {
    const titleInput = document.getElementById('revTitle');
    const title = titleInput.value;
    if(!title) return alert('введите название');
    
    try {
        const res = await fetch('https://dummyjson.com/posts/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, userId: 5 })
        });
        const data = await res.json();
        alert('успешно! рецензия на "' + data.title + '" создана');
        titleInput.value = '';
    } catch (e) { alert('обшибка'); }
}


async function editReview(id) {
    try {
        const res = await fetch(`https://dummyjson.com/posts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'ОБНОВЛЕННАЯ РЕЦЕНЗИЯ' })
        });
        const data = await res.json();
        const titleEl = document.getElementById(`t-${id}`);
        if(titleEl) titleEl.innerText = data.title;
        alert('успешно! данные на сервере заменены');
    } catch (e) { alert('обшибка'); }
}


async function showWatchlist() {
    renderLoader();
    try {
        const res = await fetch('https://dummyjson.com/todos?limit=5');
        const data = await res.json();

        root.innerHTML = `
            <div class="container">
                <h1>список к просмотру</h1>
                <div id="watchlist"></div>
            </div>
        `;

        const list = document.getElementById('watchlist');
        data.todos.forEach(item => {
            const div = document.createElement('div');
            div.className = 'movie-card';
            div.style = 'display:flex; justify-content:space-between; align-items:center; padding:20px; margin:10px 0;';
            div.id = `item-${item.id}`;
            div.innerHTML = `
                <span style="${item.completed ? 'text-decoration:line-through; color:gray' : ''}" id="txt-${item.id}">
                    фильм #${item.id}: ${item.todo}
                </span>
                <div>
                    <button class="btn btn-outline" onclick="toggleWatched(${item.id}, ${item.completed})">PATCH</button>
                    <button class="btn btn-primary" style="background:#555" onclick="deleteFromList(${item.id})">DEL</button>
                </div>
            `;
            list.appendChild(div);
        });
    } catch (e) { root.innerHTML = "обшибка списка"; }
}


async function toggleWatched(id, status) {
    try {
        const res = await fetch(`https://dummyjson.com/todos/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !status })
        });
        const data = await res.json();
        const el = document.getElementById(`txt-${id}`);
        if(el) {
            el.style.textDecoration = data.completed ? 'line-through' : 'none';
            el.style.color = data.completed ? 'gray' : 'inherit';
        }
        alert('успешно! статус фильма изменен.');
    } catch (e) { alert('обшибка'); }
}


async function deleteFromList(id) {
    if(confirm('удалить из списка навсегда?')) {
        try {
            await fetch(`https://dummyjson.com/todos/${id}`, { method: 'DELETE' });
            const el = document.getElementById(`item-${id}`);
            if(el) el.remove();
            alert('успешно! запись удалена.');
        } catch (e) { alert('обшибка'); }
    }
}


showCatalog();