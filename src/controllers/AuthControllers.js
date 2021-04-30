const { mysqldb } = require("./../connections");
const {
  createAccessToken,
  createEmailVerifiedToken,
  createTokenRefresh,
  createTokenForget,
} = require("./../helpers/createToken");
const fs = require("fs");
const hashpass = require("./../helpers/hashingpass");
const { v4: uuidv4 } = require("uuid");
const { promisify } = require("util");
const path = require("path");
const handlebars = require("handlebars");
const transporter = require("./../helpers/transporter");
const dba = promisify(mysqldb.query).bind(mysqldb);
const jwt = require("jsonwebtoken");

const dbprom = (query, arr = []) => {
  return new Promise((resolve, reject) => {
    mysqldb.query(query, arr, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  Register: async (req, res) => {
    try {
      const { email, username, password } = req.body;
      if (!email || !username || !password) {
        return res.status(400).send({ message: "bad request" });
      }
      let sql = `select * from users where username=? `;
      const datausers = await dba(sql, [username]);
      if (datausers.length) {
        return res.status(500).send({ message: "username telah terdaftar" });
      } else {
        sql = `insert into users set ?`;
        const id = uuidv4();
        let data = {
          id: id,
          username: username,
          password: password,
          email: email,
          uid: Date.now(),
        };
        await dba(sql, data);
        sql = `select id,uid,username,email from users where id = ? `;

        const datauser = await dba(sql, [id]);
        console.log(datauser);
        let filepath = path.resolve(
          __dirname,
          "../template/emailVerification.html"
        );
        const htmlrender = fs.readFileSync(filepath, "utf-8");
        const template = handlebars.compile(htmlrender);
        let dataToken = {
          id: datauser[0].id,
          username: datauser[0].username,
        };
        const tokenEmail = createEmailVerifiedToken(dataToken);
        const tokenAccess = createAccessToken(dataToken);

        const tokenRefresh = createTokenRefresh(dataToken);
        const link = "http://localhost:3000/verified/" + tokenEmail;
        const htmltoemail = template({ username: username, link: link });
        await transporter.sendMail({
          from: "<dedimashuri16@gmail.com>",
          to: email,
          subject: "JCWM1604",
          html: htmltoemail,
        });
        res.set("x-token-access", tokenAccess);
        res.set("x-token-refresh", tokenRefresh);

        return res.status(200).send({ ...datauser[0], cart: [] });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "server error" });
    }
  },
  keeplogin: async (req, res) => {
    try {
      const { id } = req.user;
      let sql = `select id,username,email,role from users where id = ? `;
      // get data user lagi
      const datauser = await dba(sql, [id]);
      return res.status(200).send(datauser[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "server error" });
    }
  },
  login: async (req, res) => {
    try {
      const { emailorusername, password } = req.body;
      if (!emailorusername || !password) {
        return res.status(400).send({ message: "bad request" });
      }
      let sql = `select id,uid,username,email,status,role from users where (username= ? or email = ?) and password = ? `;
      const datauser = await dba(sql, [
        emailorusername,
        emailorusername,
        hashpass(password),
      ]);
      if (datauser.length) {
        let dataToken = {
          id: datauser[0].id,
          username: datauser[0].username,
        };
        const tokenAccess = createAccessToken(dataToken);
        const tokenRefresh = createTokenRefresh(dataToken);
        res.set("x-token-access", tokenAccess);
        res.set("x-token-refresh", tokenRefresh);
        return res.status(200).send(datauser[0]);
      } else {
        return res.status(500).send({ message: "username tidak terdaftar" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "server error" });
    }
  },
  deactiveAccount: async (req, res) => {
    try {
      const { id } = req.params;
      let dataupdate = {
        status: "deactive",
      };
      let sql = `update users set ? where id = ? `;
      await dba(sql, [dataupdate, id]);
      return res.status(200).send({ message: "update" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "server error" });
    }
  },
  activeAcount: async (req, res) => {
    try {
      const { id } = req.params;
      let dataupdate = {
        status: "active",
      };
      let sql = `update users set ? where id = ? `;
      await dba(sql, [dataupdate, id]);
      return res.status(200).send({ message: "update" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "server error" });
    }
  },
  closeAcount: async (req, res) => {
    try {
    } catch (error) {}
  },
};
