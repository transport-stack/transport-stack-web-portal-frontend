import { downloadResourceAPI } from "../services/apiservices";

//Format date to 'DD-MM-YYYY'
export const formatDate = (date) => {
  if (!date) {
    return '';
  }
  if (isNaN(date.getTime())) {
    return '';
  }
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

//map content types to file extensions
const getExtensionFromContentType = (contentType) => {
  switch (contentType) {
    case 'application/pdf':
      return 'pdf';
    case 'application/msword':
      return 'doc';
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'docx';
    case 'application/vnd.ms-excel':
      return 'xls';
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return 'xlsx';
    case 'image/png':
      return 'png';
    case 'image/jpeg':
      return 'jpg';
    case 'image/svg+xml':
      return 'svg';
    case 'application/zip':
      return 'zip';
    case 'application/zip':
      return 'zip';
    default:
      return 'file';
  }

}

//Download resources document
export const downloadResource = (category, subcategory, title = 'file') => {
  const downloadFile = async () => {
    return downloadResourceAPI(category, subcategory);
  };
  downloadFile()
    .then(response => {
      const contentType = response.headers.get('content-type');
      const extension = getExtensionFromContentType(contentType);
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      // the filename to display
      a.download = title + '.' + extension;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.parentNode.removeChild(a);
    }).catch((error) => {
      console.log(error);
    });
}
