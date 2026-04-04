import { configureStore, createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Movie {
    id: number;
    name: string;
    image?: { medium: string };
    rating: { average: number | null };
    genres: string[];
}

interface Review {
    id: number;
    title: string;
    userId?: number;
}

interface AppState {
    movies: Movie[];
    reviews: Review[];
    loading: boolean;
}

const initialState: AppState = {
    movies: [],
    reviews: [],
    loading: false
};


export const fetchMovies = createAsyncThunk('movies/fetch', async () => {
    const res = await axios.get('https://api.tvmaze.com/search/shows?q=movie');
    return res.data.map((item: any) => item.show) as Movie[];
});


export const fetchReviews = createAsyncThunk('reviews/fetch', async () => {
    const res = await axios.get('https://dummyjson.com/posts?limit=3');
    return res.data.posts as Review[];
});



const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {

        updateReviewLocal: (state, action: PayloadAction<Review>) => {
            const index = state.reviews.findIndex((r) => r.id === action.payload.id);
            if (index !== -1) {
                state.reviews[index] = action.payload;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovies.pending, (state) => { 
                state.loading = true; 
            })
            .addCase(fetchMovies.fulfilled, (state, action) => {
                state.movies = action.payload;
                state.loading = false;
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.reviews = action.payload;
            });
    }
});

export const { updateReviewLocal } = appSlice.actions;
export const store = configureStore({ 
    reducer: { app: appSlice.reducer } 
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;