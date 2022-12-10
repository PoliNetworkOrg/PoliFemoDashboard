export const showToast = (message, type) => {
  var toast = document.getElementById("toastest");
  switch (type) {
    case "error":
      toast.className = "toast align-items-center border-0 bg-danger";
      break;
    case "success":
      toast.className = "toast align-items-center border-0 bg-success";
      break;
    default:
      toast.className = "toast align-items-center border-0 bg-info";
      break;
  }

  var toastBody = toast.getElementsByClassName("toast-body")[0];
  toastBody.innerText = message;
  var toastStack = document.getElementById("toast-stack");
  toastStack.appendChild(toast);
  var toastObj = new bootstrap.Toast(toast);
  toastObj.show();
};
