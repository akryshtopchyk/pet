import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Trips from './components/trips/trips';
import Trip from './components/trips/trip';
import Root from './components/root';
import TripsIndex from './components/trips/tripsIndex';
import NoMatch from './components/noMatch';
import News from './components/news/news';
import NewsIndex from './components/news/newsIndex';
import Users from './components/users/users';
import User from './components/users/user';
import UsersIndex from './components/users/usersIndex';
import Login from './components/login/login';
import { createContext, useState } from 'react';
import TripsGI from './components/tripsGI/tripsGI';
// import TripGI from './components/tripsGI/tripGI';
import TripsGIIndex from './components/tripsGI/tripsGIIndex';
import TripsMI from './components/tripsMiAll/trips';
import TripsIndexMI from './components/tripsMiAll/tripsIndex';

export const UserContext = createContext();

const App = () => {
  const [user, setUser] = useState();

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: '/trips',
          element: <Trips />,
          children: [
            { index: true, element: <TripsIndex /> },
            {
              path: '/trips/:id',
              element: <Trip />,
            },
          ],
        },
        {
          path: '/tripsMI',
          element: <TripsMI />,
          children: [
            { index: true, element: <TripsIndexMI /> },
            {
              path: '/tripsMI/:id',
              element: <Trip />,
            },
          ],
        },
        {
          path: '/tripsGI',
          element: <TripsGI />,
          children: [
            { index: true, element: <TripsGIIndex /> },
            {
              path: '/tripsGI/:id',
              element: <Trip />,
            },
          ],
        },
        {
          path: '/news',
          element: <News />,
          children: [{ index: true, element: <NewsIndex /> }],
        },
        {
          path: '/users',
          element: <Users />,
          children: [
            { index: true, element: <UsersIndex /> },
            {
              path: '/users/:id',
              element: <User />,
            },
          ],
        },
      ],
    },
    { path: '*', element: <NoMatch /> },
  ]);

  return (
    <UserContext.Provider value={[user, setUser]}>
      {user ? <RouterProvider router={router} /> : <Login />}
    </UserContext.Provider>
  );
};

export default App;
