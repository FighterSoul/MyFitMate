const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const mongoUrl="mongodb+srv://hediabdessalem:bMyDmqaW4YipwTH1@cluster0.ycradxw.mongodb.net/test?retryWrites=true&w=majority";

const JWT_SECRET="kibgikuhjhikuhiuhohikljh64654567789697$%/&/§";


mongoose.connect(mongoUrl)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

require('./schema/UserDetails');

const User = mongoose.model('UserDetail');

//create get API

app.get('/', (req, res) => {
    res.send('Started');
});

app.post('/register', async(req, res) => {
    const {username, email, password}=req.body;

    const oldUser = await User.findOne({username: username});

    if(oldUser) {
        return res.send({status: 'ERROR', data: 'User already exists'});
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    try {
        await User.create({
            username: username,
            email: email,
            password: encryptedPassword,
        });
        res.send({status: 'OK', data: 'User created successfully'});
    }catch(err) {
        res.send({status: 'ERROR', data: err});
    }
     
});

app.post('/login-user', async(req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).send({ status: 'ERROR', data: 'Username and password are required' });
    }

    try {
        const oldUser = await User.findOne({ username: username });

        if (!oldUser) {
            return res.status(400).send({ status: 'ERROR', data: "User doesn't exist!" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

        if (isPasswordCorrect) {
            const token = jwt.sign({ username: oldUser.username }, JWT_SECRET);
            return res.send({ status: 'OK', data: token });
        } else {
            return res.status(400).send({ status: 'ERROR', data: 'Invalid username/password' });
        }
    } catch (error) {
        return res.status(500).send({ status: 'ERROR', data: 'Internal server error' });
    }
});


app.post("/userdata", async(req, res)=>{
    const { token }=req.body;
    try {
        const user=jwt.verify(token, JWT_SECRET);
        const username= user.username; 

        User.findOne({username:username}).then((data)=> {
            return res.send({status: "OK", data: data});    
        });
    }catch(error){
        return res.send({error: error})
    }
});


app.listen(4001, () => {
    console.log('Server is running on port 4001');
})

