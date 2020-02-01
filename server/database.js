const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const assert = require('assert');

const SALT_ROUNDS = 10;
const DB = 'chat-app'
const COLLECTION = 'users'
const uri = `mongodb://admin:${encodeURIComponent(process.env.admin)}@brads-cluster-shard-00-00-tkw5d.azure.mongodb.net:27017,brads-cluster-shard-00-01-tkw5d.azure.mongodb.net:27017,brads-cluster-shard-00-02-tkw5d.azure.mongodb.net:27017/test?ssl=true&replicaSet=brads-cluster-shard-0&authSource=admin&retryWrites=true&w=majority`
const client = new MongoClient(uri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

var collection
var ObjectId = require('mongodb').ObjectId; 

client.connect(err => {
    assert.equal(null, err);
    collection = client.db(DB).collection(COLLECTION)
})

const createNewUser = (username, password, callback) => {
    
    bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
        assert.equal(null, err);

        collection.findOneAndUpdate(
        { username: username }, 
        { $set: { password: hash }},
        { upsert: true},
        (err, res) => {
            callback(err, res)
        }
        )
    })
      
}

const verifyUser = (username, password, callback) => {

    collection.findOne({
        username: username
    }).then( (res) => {
        if ( !res ) {
            callback('Error: no user found', false)
            throw new Error("User not found")
        } else {

            bcrypt.compare(password, res.password, function(err, valid) {
                if ( valid ){
                    callback(null, res)
                } else {
                    callback(err, null)
                }
                
            });
        }
    }).catch( err => {
        console.log("Error:", err)
    })

}

const findUserById = ( id, callback )=> {
    collection.findOne({
        _id: new ObjectId(id)
    }).then ( (res) => {
        if ( !res ) {
            callback('Error: user id not found', false)
            throw new Error("User id not found")
        } else {
            callback( res )
        }
    }).catch( err => {
        console.log(err)
    })
}

exports.createNewUser = createNewUser;
exports.verifyUser = verifyUser;
exports.findUserById = findUserById;