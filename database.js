const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');

const DB = 'chat-app'
const COLLECTION = 'users'

const SALT_ROUNDS = 10;

const uri = `mongodb://admin:${encodeURIComponent(process.env.admin)}@brads-cluster-shard-00-00-tkw5d.azure.mongodb.net:27017,brads-cluster-shard-00-01-tkw5d.azure.mongodb.net:27017,brads-cluster-shard-00-02-tkw5d.azure.mongodb.net:27017/test?ssl=true&replicaSet=brads-cluster-shard-0&authSource=admin&retryWrites=true&w=majority`

const client = new MongoClient(uri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

const createNewUser = (username, password, callback) => {
    client.connect(err => {
        const collection = client.db(DB).collection(COLLECTION);
        
        bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
      
          const hashed = hash
          collection.findOneAndUpdate(
            { username: username }, 
            { $set: { password: hashed }},
            { upsert: true},
            (err, res) => {
                callback(err, res)
            }
          )
        })
      
      });
}

const verifyUser = (username, password, callback) => {
    client.connect(err => {
        const collection = client.db(DB).collection(COLLECTION);

        collection.findOne({
            username: username
        }).then( (res) => {
            if ( !res ) {
                console.error("Error: no user found")
                throw new Error("User not found")
            } else {
                console.log(res)
                bcrypt.compare(password, res.password, function(err, res) {
                    callback(err, res)
                });
            }
        })
    });
}

exports.createNewUser = createNewUser;
exports.verifyUser = verifyUser;