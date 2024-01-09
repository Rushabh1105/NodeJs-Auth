import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import { PORT } from './config/server.config.js';
import { connectToDB } from './config/mongoose.db.js';
import userRoutes from './routes/user.routes.js';
import './utils/google.auth.js';

const app = express();

app.use(session({
    secret: 'topSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressEjsLayouts);
app.use(express.static('./assets'));
app.set('view engine', 'ejs');
app.set('views', './views')
app.set("layout extractStyles", true);
app.set('layout extractScript', true);
app.use('/', userRoutes);

app.listen(PORT, async () => {
    await connectToDB()
    console.log(`Server started on port ${PORT}`)
})