import strings from "@/stores/strings.json";
export const getString = (key, ...args) => {
    var str = strings[key];
    for (var i = 0; i < args.length; i++) {
        str = str.replace("%" + (i+1), args[i]);
      }
    return str;
}