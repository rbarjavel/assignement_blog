const crypto = require("crypto");

const secret = "my_blog_hashing_string"

const hash_string = (passwd) => {
    const md5Hasher = crypto.createHmac("md5", secret);
    const hash = md5Hasher.update(toString(passwd)).digest("hex");

    return (hash)
}

module.exports = hash_string
