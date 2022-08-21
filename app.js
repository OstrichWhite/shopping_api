const express= require('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors=require('cors')
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp'); //http parameter pollution

const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
// const likeRouter = require('./routes/likeRoutes');

dotenv.config({ path: './config.env' });
const app = express();

//public api
app.use(cors({
  origin: '*'
}));
mongoose.connect(process.env.DATABASE,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
  console.log('DB Connected')
});


//GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//set Security HTTP header
app.use(helmet()); //function call do middleware action

// Development Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Limit request from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please Try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); //for incoming requests with JSON payloads

// Data sanitization against NoSQL query injection // {"email": {"$ge":""}}
app.use(mongoSanitize()); // it remove mongoose operator like $

// Data sanitization against XSS
app.use(xss()); //it convert html syntax elements like '<' to &lt;

// Prevent parameter pollution
app.use(hpp()); //remove duplicate parameters



// ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
// app.use('/api/v1/likes', likeRouter);

app.get('/',(req,res)=>{
  res.status(200).json({ status:'success', message: 'I am alive'})
})

app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this Server`,
  })
});

const port = process.env.PORT || 1234;
app.listen(port,()=>{
  console.log(`Server run on port ${port}`)
})