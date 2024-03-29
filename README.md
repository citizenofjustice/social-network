# StayInTouch [![Static Badge](https://img.shields.io/badge/Open_website-grey)](https://social-network-frontend.vercel.app)

A full-stack social-network pet-project built with [![Static Badge](https://img.shields.io/badge/MongoDB-%2300ed64)](https://www.mongodb.com) [![Static Badge](https://img.shields.io/badge/Express-%237e7e7e)](https://expressjs.com) [![Static Badge](https://img.shields.io/badge/React-%23149eca)](https://react.dev) and [![Static Badge](https://img.shields.io/badge/Node-%23417e38)](https://nodejs.org).

## Features

- **User registration & authentication:** Registration is required for using the application. The app utilizes JSON Web tokens stored locally for authentication.
- **Basic social network functionality:** Posts, comments, subscriptions lists, likes, social links in profiles, change of user email and password.
- **Responsive and Interactive UI:** Responsive layout for different screen sizes and interactivity for enhanced user experience. Separete layout for mobile.
- **Infinite scroll:** Instead of regular pagination, the project loads the next batch of posts when the end of the current batch is reached.
- **Image converter for uploaded images:** Optimization of images by converting to .webp format and resizing large images.
- **Lazy loading of images:** Optimizing initial load times with lazy loading of images not present in the viewport.
- **Redux/Redux-toolkit state management:** Allows for dynamic state changes across the app without prop drilling.
- **Light/Dark mode:** User able to choose a preferred color scheme. Colors were picked with [figma-polychrom](https://github.com/evilmartians/figma-polychrom).

## Animated gifs of app
  <details>
  <summary>Mobile layout</summary>
    <table>
      <tbody>
        <tr>
          <td>
            <img width="200" alt="auth and pagination gif" src="https://github.com/citizenofjustice/social-network/assets/13840466/2bdc4c9b-9f29-483c-9477-679829cdc72d" />            
          </td>
          <td>
            <img width="200" alt="search gif" src="https://github.com/citizenofjustice/social-network/assets/13840466/0247d069-1ec0-4e38-a0b1-832aac0b2766" />
          </td>
          <td>
            <img width="200" alt="light/dark mode gif" src="https://github.com/citizenofjustice/social-network/assets/13840466/570c5621-b3b7-4ba0-a008-73bce4310c58" />
          </td>
        </tr>
      </tbody>
    </table>
  </details>

  <details>
  <summary>Desktop layout</summary>
    <table>
      <tbody>
        <tr>
          <td align="center">
            <video src="https://github.com/citizenofjustice/social-network/assets/13840466/a50ace91-e5e0-4f10-81cd-40ac2534c8a0"></video>           
          </td>
        </tr>
        <tr>
          <td align="center">
            <video src="https://github.com/citizenofjustice/social-network/assets/13840466/c9165b6e-1ac6-45fa-913d-1461caccd9c5"></video>           
          </td>
        </tr>
        <tr>
          <td align="center">
            <video src="https://github.com/citizenofjustice/social-network/assets/13840466/0272c969-84b8-40d3-8cc3-bd9d7c8caa93"></video>           
          </td>
        </tr>
      </tbody>
    </table>
  </details>


## Tech

- [React](https://react.dev)
- [MongoDB](https://www.mongodb.com)
- [Node.js](https://nodejs.org)
- [Express.js](https://expressjs.com)
- [Mongoose](https://mongoosejs.com)
- [Redux/Redux-toolkit](https://redux.js.org)
- [Material UI](https://mui.com/material-ui/)
- [Firebase-Storage](https://firebase.google.com)
- [Vercel](https://vercel.com)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env files in both client and server directories.

#### client/.env

```
# Your server url (for development mode use http://localhost:PORT/ )
REACT_APP_API_URL=https://your-site.com/
```

#### server/.env

```
# Database connection string (need to set user, password, cluster)
MONGO_URL=mongodb+srv://myDatabaseUser:D1fficultP%40ssw0rd@cluster0.example.mongodb.net/?retryWrites=true&w=majority
# Set your JWT secret string
JWT_SECRET=...
# Set port for running server
PORT=...

# Firebase config data
API_KEY=...
AUTH_DOMAIN=...
PROJECT_ID=...
STORAGE_BUCKET=...
MESSAGING_SENDER_ID=...
APP_ID=...
MEASUREMENT_ID=...
```
