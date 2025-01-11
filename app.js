const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

// const cookieParser = require('cookie-parser');
// const { authenticateToken, requireAuth, checkout } = require('./src/middleware/authMiddleware');

const app = express();
const PORT = 3000;

const Handlebars = require('handlebars');

// Đăng ký helper limit
Handlebars.registerHelper('limit', function (array, limit) {
    return array.slice(0, limit);
});
Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});
Handlebars.registerHelper('times', function(n, block) {
    let result = '';
    for (let i = 1; i <= n; i++) {
        result += block.fn(i);
    }
    return result;
});
Handlebars.registerHelper('round', (value) => {
    return Math.round(value);
  });
  
  // Helper để cộng hai số
  Handlebars.registerHelper('add', (a, b) => {
    return a + b;
  });
const viewsRoutes = require('./src/routes/viewsRoutes');
const tourRoutes = require('./src/routes/tourRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(cookieParser());
// app.use(authenticateToken);

//Handlebars
app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main' // Layout chính
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src', 'views'))

app.use(express.static(path.join(__dirname, 'src', 'public')));

app.use('/', viewsRoutes);

app.use('/tour-management', tourRoutes);

// app.use('/register', checkout, registerRoutes);

// app.use('/login', checkout, loginRoutes);

// app.use('/logout', requireAuth, logoutRoute);

// app.use('/verify', checkout, verifyRoutes);

// app.use('/user', requireAuth, userRoutes);

// app.use('/feedback', feedbackRoutes);

// app.use('/reservation', reservationRoutes);

// app.use('/cart', cartRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
