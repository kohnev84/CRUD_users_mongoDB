const express = require("express");
const app = express();
const path = require('path');
const mongoose = require("mongoose")
const User = require("./models/user");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Подключаем статику
app.use(express.static(path.join(__dirname, 'public')));

// Подключаем views(hbs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Отображаем главную страницу с использованием шаблона "index.hbs"
app.get('/', function (req, res) {
    res.render('index', req.query);
});

app.get('/users', function (req, res) {
    res.render('users', req.query);
});
async function start() {
    try {
        await mongoose.connect(
            `mongodb+srv://kohnev84:kohnev84@cluster0.60tfe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        );
    } catch (e) {
        console.log(e.message)
    }

}
start()

app.post('/addnewuser', async (req, res, next) => {
    console.log(req.body.name, req.body.last_name, req.body.age, req.body.education, req.body.height, req.body.weight, req.body.gender)
    const { name, last_name, age, education, height, weight, gender } = req.body
    const user = new User({
        name,
        last_name,
        age,
        education,
        height,
        weight,
        gender,
    });
    await user.save();
    res.status(200).send(`пользователь сохранен ${req.body.name}`);



});
app.post('/getall', async (req, res, next) => {

    let allusers = await User.find()
    console.log(allusers)
    res.status(200).send({ result: allusers })
});
app.post('/updateuser', async (req, res, next) => {
    console.log(req.body.update_name)
    let user = await User.findOne({ name: `${req.body.update_name}`, last_name: `${req.body.update_last_name}`, age: `${req.body.update_age}`, education: `${req.body.update_education}`, height: `${req.body.update_height}`, weight: `${req.body.update_weight}`, gender: `${req.body.update_gender}` });
    console.log(user)
    if (user !== null && req.body.select_content === "name") {
        console.log("обновление имени пользователя")
        await User.updateOne(
            { name: `${req.body.update_name}`, last_name: `${req.body.update_last_name}`, age: `${req.body.update_age}`, education: `${req.body.update_education}`, height: `${req.body.update_height}`, weight: `${req.body.update_weight}`, gender: `${req.body.update_gender}` },
            {
                $set: {
                    name: req.body.update_content
                }
            })
    } else if (user !== null && req.body.select_content === "last_name") {
        console.log("обновление фамилий пользователя")
        await User.updateOne(
            { name: `${req.body.update_name}`, last_name: `${req.body.update_last_name}` },
            {
                $set: {
                    last_name: req.body.update_content
                }
            })
    }
})
app.post('/delete_user', async (req, res, next) => {
    console.log(req.body.delete_name, req.body.delete_last_name)
    try {
        await User.findOneAndDelete({ name: `${req.body.delete_name}`, last_name: `${req.body.delete_last_name}` })
        res.json({ response: 'success' })
    } catch (e) {
        res.status(404)
    }
});
const port = process.env.PORT || 3001;
app.listen(port, () => console.log("Listening on " + port));