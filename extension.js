document.body.style.border = "5px solid red";
const headings = document.getElementsByClassName("heading");
const titles = Array.prototype.slice.call(headings, 0 );
titles.forEach(element => {
    element.style.color = "red";
});