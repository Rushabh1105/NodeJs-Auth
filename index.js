// Importing required dependencies
import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';

// Importing required modules
import { PORT } from './config/server.config.js';
import { connectToDB } from './config/mongoose.db.js';
import userRoutes from './routes/user.routes.js';
import './utils/google.auth.js';

// Express App
const app = express();

// Setting up required mechanisms
app.use(session({ //For creating session
    secret: 'topSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));
// For google auth
app.use(passport.initialize());
app.use(passport.session());
// For setting jwt cookies
app.use(cookieParser());
// For parsing JSON body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// For Views
app.use(expressEjsLayouts);
app.use(express.static('./assets'));
app.set('view engine', 'ejs');
app.set('views', './views')
app.set("layout extractStyles", true);
app.set('layout extractScript', true);
// Different Routes
app.use('/', userRoutes);

// Listen on port
app.listen(PORT, async () => {
    await connectToDB()
    console.log(`Server started on port ${PORT}`)
})