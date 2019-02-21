/**
 * @file app.js
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 20/02/2019
 * 
 */

if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", user => {
    if (!user) {
      window.netlifyIdentity.on("login", () => {
        document.location.href = "/admin/";
      });
    }
  });
}
