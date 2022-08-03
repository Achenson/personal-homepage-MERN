import multer = require("multer");

export let newBackgroundImageName: string;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const authHeader = req.get("Authorization");
    // console.log(req.headers);
    // const authHeader = req.headers.authorisation;

    console.log("req is  Auth multer");
    // @ts-ignore
    console.log(req.isAuth);
    // @ts-ignore
    if (!req.isAuth || !req.userId) return;

    // console.log("req user id storage multer");
    // console.log(req.userId);

    console.log("Storage multer");
    console.log(authHeader);

    // @ts-ignore
    // userIdOrDemoId = req.isAuth ? req.userId : testUserId
    // userIdOrDemoId = req.userId ? req.userId : testUserId
    // let dest = "backgroundImgs/" + userIdOrDemoId + "/";

    // let userIdOrTestId = req.isAuth ? req.userId : testUserId;

    let dest = "backgroundImgs/" + req.userId + "/";
    // let dest = "backgroundImgs/" + userIdOrTestId + "/";

    // mkdirp.sync(dest);
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    let fileOriginalNameMod = file.originalname.replace(/\s/g, "_");

    let newFileName = Date.now() + "_" + fileOriginalNameMod;
    // let newFileName = Date.now() + "_" + file.originalname;
    cb(null, newFileName);
    newBackgroundImageName = newFileName;
    console.log("NAMEEEE");
    console.log(newBackgroundImageName);
  },
});

function fileFilter(
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
    // cb(new Error("Only .jpg and .png files are accepted"));
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

// let backgroundImgUpload = upload.single("file");
export let backgroundImgUpload = upload.any();

