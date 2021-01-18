module.exports = (title, text1, text2, link) => {
    const a = link ? `<a style="background-color: #0277bd; padding: 0.8rem; color: white; font-size: 1.1rem; margin: 1rem;" href="${link.href}">${link.text}</a>` : null;
    const p1 = text1 ? `<p>${text1}</p>` : null;
    const p2 = text2 ? `<p>${text2}</p>` : null;;

    const htmlMail = [
        "<body style='width: 60%; margin: auto; background-color: #e3f2fd; padding-top: 2rem;'>",
        "<div style='font-family: sans-serif; line-height: 1.7rem; width: 90%; margin: auto; background-color: #fafafa; box-sizing: border-box; padding: 10%; padding-top: 0; border-radius: 10px;'>",
        `<h1 style="text-align: center; padding-top: 1.2rem;">${title}</h1>`,
        p1,
        a,
        p2,
        "</div>",
        "</div>",
        "<div style='text-align: center; color: #757575;'>",
        '<p style="margin: 0.7rem;">Made with &#x1f49c; by <a style="color: #757575;" href="https://twitter.com/Crys_Dev">Vincent Rouilhac</a></p>',
        '<p style="margin: 0.7rem;">Alexander Island, Antarctica</p>',
        '</div>',
        "</body>"
    ];

    return htmlMail.join(" ");
}