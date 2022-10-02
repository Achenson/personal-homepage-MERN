import multer = require("multer");
import fsExtra = require("fs-extra");

export let newBackgroundImageName: string;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // const authHeader = req.get("Authorization");
    console.log("req is Auth multer");
    // @ts-ignore
    console.log(req.isAuth);
    // @ts-ignore
    if (!req.isAuth || !req.userId) return;
    // console.log("Storage multer");
    // console.log(authHeader);

    // @ts-ignore
    const backgroundDir = "backgroundImgs/" + req.userId;
    fsExtra.ensureDirSync(backgroundDir);

    // @ts-ignore
    let dest = "backgroundImgs/" + req.userId + "/";
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    let fileOriginalNameMod = file.originalname
      .replace(/\s/g, "_")
      .replace(/\(/g, "")
      .replace(/\)/g, "");
    let newFileName = Date.now() + "_" + fileOriginalNameMod;
    cb(null, newFileName);
    newBackgroundImageName = newFileName;
    console.log(newBackgroundImageName);
  },
});

function fileFilter(
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
    cb(new Error("Only .jpg and .png files are accepted"));
    return;
  }

  cb(null, true);
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: fileFilter,
});

export let backgroundImgUpload = upload.any();
