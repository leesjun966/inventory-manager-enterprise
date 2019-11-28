const qrcode = require("qrcode");

const path = require("./path");

const generate_qr = (filepath, data, size = 500) => {
  qrcode.toFile(
    filepath,
    data,
    { errorCorrectionLevel: "M", width: size },
    function(err) {
      if (err) throw err;
      console.log("Generated", data);
    }
  );
};

var materials = ["Steel", "Iron", "Wood", "PVC", "Nail", "Chair", "Table"];

const generate_multiple = mat_list => {
  for (var i = 0; i < mat_list.length; i++) {
    var code = "A000000" + (i + 1);
    var file_path = path + "/generated/" + mat_list[i] + ".png";
    generate_qr(file_path, code);
  }
};

generate_multiple(materials);
