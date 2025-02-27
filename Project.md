# Text Similarity Game

A web application that allows users to rate the similarity between pairs of text, serving both as an interactive game and a tool for collecting human feedback to train AI models.

## Core Features and Functionality

1. **Similarity Rating System**: Users can rate how similar two texts are on a scale from 0 to 10 with high precision (up to three decimal places).
2. **Text Comparison Interface**: A clean, minimalist interface displays two texts with numbered indicators (1️⃣ and 2️⃣) for easy comparison.
3. **Interactive Slider**: A custom slider component with an enlarged, visually appealing thumb for intuitive interaction.
4. **Match Management System**: Smart database integration that efficiently manages text pairs, including checkout and persistence mechanisms.
5. **Loading Screens**: Smooth transitions with loading animations when submitting ratings or initializing.

## Technical Architecture

### Frontend

- **React with TypeScript**: Strong typing for better code quality and developer experience.
- **TanStack Query (React Query)**: For data fetching, caching, and state synchronization.
- **Tailwind CSS**: For styling with a modern, responsive design.
- **Custom Hooks**: Including `useStoredState` for persistent state management.

### Backend

- **Supabase**: For database operations and API endpoints.
- **PostgreSQL Functions**: Custom functions like `get_or_create_match` and checkout mechanisms.
- **Row Level Security (RLS)**: For data access control.

### State Management

- **Local Storage Persistence**: Session IDs and match IDs are stored persistently.
- **React Query Cache**: For efficient data fetching and updating.
- **Reactive State Handling**: Using custom hooks that combine React state with storage.

## How the App Works

1. **Initialization**:
   - When a user opens the app, it generates or retrieves a unique session ID.
   - It checks for an existing match in localStorage.
   - If a match exists and hasn't been rated, the app checks it out for this session.
   - Otherwise, it finds an available unrated match or creates a new one.

2. **User Experience**:
   - The user sees two texts to compare.
   - They use the slider to rate similarity from 0 to 10.
   - After submitting, a brief loading screen appears while the app:
     - Saves the rating to the database
     - Gets a new match pair
     - Updates the UI

3. **Match Checkout System**:
   - To prevent multiple users from rating the same match, we implemented a checkout system.
   - Matches are checked out for 5 minutes, after which they become available again.
   - This system optimizes database usage by reusing unrated matches.

4. **State Persistence**:
   - If a user closes the browser and returns, they'll continue with their previous match.
   - The app intelligently handles cases where matches were completed or expired.

## Key Components

### SimilaritySlider

A custom slider component that allows users to rate similarity with high precision. Features:
- Range from 0 to 10 with three decimal places of precision
- Large, visually appealing slider thumb
- Gradient visual feedback
- Hover and focus states for better accessibility

### TextComparison

A minimalist component that displays two texts side by side with numbered indicators for easy reference. Features:
- Clean layout with circled number indicators
- Color coding (blue and purple) for visual distinction
- Responsive design that works on various screen sizes

### Match Management System

A database-backed system for managing text pairs and ratings:
- `get_or_create_match` function for efficient match assignment
- Checkout system to prevent duplicate ratings
- Session persistence for user continuity

### LoadingScreen

An animated overlay that provides visual feedback during loading states.

## Database Schema

### Tables

- **texts**: Contains individual text snippets
- **matches**: Pairs of texts with metadata and similarity ratings

### Key Columns in matches

- `id`: Unique identifier
- `text_1`: Reference to first text
- `text_2`: Reference to second text
- `result`: Decimal value storing similarity rating
- `checkout_at`: Timestamp of when the match was checked out
- `checkout_session_id`: Session ID of who has the match checked out

## Future Enhancements

Potential areas for future development:

1. User accounts and personalized statistics
2. Leaderboards and gamification elements
3. More sophisticated match selection algorithms
4. Expanded rating dimensions beyond single similarity score
5. Analytics dashboard for researchers 