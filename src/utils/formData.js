const Busboy = require("busboy");
//crear una instancia de este prototipo
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.formData = (req, res, next) => {
  const busboy = new Busboy({ headers: req.headers });
  //busboy intancia de BUsboy para que sepa que
  // todos los encabezados que llegan en la petion se lo voy a pasar a busboy
  req.body = {}; //se reciben campos typo texto, string booleano numero o archivo file bufer string

  let uploadingFile = false;
  let uploadingCount = 0;

  function done() {
    if (uploadingFile) return next();
  }
  //busboy esta orientado a eventos
  busboy.on("field", (key, value) => {
    req.body[key] = value;
  }); //type text

  busboy.on("profilePhoto", (key, file) => {
    //crear un stream de caludianari para super pedazo por pedazo
    uploadingFile = true;
    uploadingCount++;
    const stream = cloudinary.uploader.upload_stream(
      {
        upload_preset: "roomatch_proyect",
      },
      (err, res) => {
        if (err) {
          throw new Error("invalid image");
        }
        req.body[key] = res.secure_url;
        console.log("req.bodyKey", req.body[key]);
        uploadingFile = false;
        uploadingCount--;
        done();
      }
    );

    file.on("data", (buffer) => {
      stream.write(buffer);
      console.log(buffer);
    });
    file.on("end", () => {
      stream.end();
      console.log("end");
    });
  }); //type fiel

  busboy.on("finish", () => {
    done();
  });

  req.pipe(busboy);
};