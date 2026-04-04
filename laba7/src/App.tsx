import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { store, fetchMovies, fetchReviews, updateReviewLocal, RootState, AppDispatch } from './store';
import './App.css';


const Loader = () => <div className="loader"></div>;


const Catalog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { movies, loading } = useSelector((state: RootState) => state.app);

    useEffect(() => { dispatch(fetchMovies()); }, [dispatch]);

    if (loading) return <Loader />;

    return (
        <div className="container movie-grid">
            {movies.map((m: any) => (
                <div key={m.id} className="movie-card">
                    <img 
    src={m.image?.medium || 'https://avatars.mds.yandex.net/i?id=2a00000179f09a4438539eb6673bbfba5c73-4479063-images-thumbs&n=13'} 
    alt={m.name} 
/>
                    <div className="movie-info">
                        <h4>{m.name}</h4>
                        <button className="btn btn-outline" onClick={() => alert('в закладках')}>в закладки</button>
                    </div>
                </div>
            ))}
        </div>
    );
};


const Reviews = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { reviews } = useSelector((state: RootState) => state.app);
    const [title, setTitle] = useState('');

    useEffect(() => { dispatch(fetchReviews()); }, [dispatch]);

    const handleAdd = async () => {
        const res = await axios.post('https://dummyjson.com/posts/add', { title, userId: 5 });
        alert('успешно! добавлена рецензия с ID: ' + res.data.id);
        setTitle('');
    };

    const handleEdit = async (id: number) => {
        const res = await axios.put(`https://dummyjson.com/posts/${id}`, { title: 'ОБНОВЛЕНО' });
        dispatch(updateReviewLocal(res.data));
        alert('данные изменены');
    };

    return (
        <div className="container">
            <h1>мои рецензии</h1>
            <div style={{background: '#3d1a10', padding: '20px', borderRadius: '8px', marginBottom: '20px'}}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="название фильма..." style={{padding: '10px', width: '200px'}} />
                <button className="btn btn-primary" onClick={handleAdd}>опубликовать</button>
            </div>
            {reviews.map((r: any) => (
                <div key={r.id} className="movie-card" style={{margin: '10px 0', padding: '15px'}}>
                    <h3>{r.title}</h3>
                    <button className="btn btn-outline" onClick={() => handleEdit(r.id)}>редактировать</button>
                </div>
            ))}
        </div>
    );
};


const Watchlist = () => {
    const [todos, setTodos] = useState<any[]>([]);

    useEffect(() => {
        axios.get('https://dummyjson.com/todos?limit=5').then(res => setTodos(res.data.todos));
    }, []);

    const handlePatch = async (id: number, status: boolean) => {
        await axios.patch(`https://dummyjson.com/todos/${id}`, { completed: !status });
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !status } : t));
        alert('статус изменен');
    };

    const handleDelete = async (id: number) => {
        await axios.delete(`https://dummyjson.com/todos/${id}`);
        setTodos(todos.filter(t => t.id !== id));
        alert('удалено');
    };

    return (
        <div className="container">
            <h1>список к просмотру</h1>
            {todos.map((t: any) => (
                <div key={t.id} className="movie-card" style={{margin: '10px 0', padding: '15px', display: 'flex', justifyContent: 'space-between'}}>
                    <span style={{textDecoration: t.completed ? 'line-through' : 'none'}}>{t.todo}</span>
                    <div>
                        <button className="btn btn-outline" onClick={() => handlePatch(t.id, t.completed)}>PATCH</button>
                        <button className="btn btn-primary" onClick={() => handleDelete(t.id)}>DEL</button>
                    </div>
                </div>
            ))}
        </div>
    );
};


function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <header className="movie-header">
                    <div className="logo">ЭТО НЕ<span>КИНОПОИСК</span></div>
                    <nav>
                        <ul className="nav-links">
                            <li><Link to="/">каталог</Link></li>
                            <li><Link to="/reviews">рецензии</Link></li>
                            <li><Link to="/watchlist">списки</Link></li>
                        </ul>
                    </nav>
                </header>

                <Routes>
                    <Route path="/" element={<Catalog />} />
                    <Route path="/reviews" element={<Reviews />} />
                    <Route path="/watchlist" element={<Watchlist />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

export default App;