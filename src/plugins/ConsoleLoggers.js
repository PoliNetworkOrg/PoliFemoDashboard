export default {
  mainLogger: {
    info: (module, message) => {
      console.log(
        "%c[" + module + "]",
        "color: #424ef5; font-weight: bold",
        message
      );
    },
    error: (module, message) => {
      console.error(
        "%c[" + module + "]",
        "color: #f50000; font-weight: bold",
        message
      );
    },
  },
};
