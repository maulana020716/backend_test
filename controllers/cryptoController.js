import crypto from "crypto";
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

export default class CryptoController {
	static async EncryptText(req, res, next) {
		let text1 = req.body.text;
		function encrypt(text) {
			let cipher = crypto.createCipheriv(
				"aes-256-cbc",
				Buffer.from(key),
				iv
			);
			let encrypted = cipher.update(text);
			encrypted = Buffer.concat([encrypted, cipher.final()]);
			return {
				iv: iv.toString("hex"),
				encryptedData: encrypted.toString("hex"),
			};
		}
		var text2 = encrypt(text1.toString());
		res.send(text2);
	}

	static async FormText(req, res, next) {
		res.render("cryptoForm");
		// res.json(restaurant);
	}
}
