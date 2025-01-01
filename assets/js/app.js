$(document).ready(function () {
  // Verifica si estamos en la raíz o en index.html
  if (
    window.location.pathname === "/" ||
    window.location.pathname.includes("index.html")
  ) {
    fetch("/assets/data/posts.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la red");
        }
        return response.json();
      })
      .then((data) => {
        let postsHtml = "";

        data.posts.forEach((post) => {
          postsHtml += `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <img src="${
                          post.url_imagen
                        }" class="card-img-top card-index" alt="${post.titulo}">
                        <div class="card-body">
                            <h5 class="card-title">${post.titulo}</h5>
                            <p class="card-text">${post.contenido.substring(
                              0,
                              100
                            )}...</p>
                            <a href="pages/blog.html?id=${
                              post.id
                            }" class="btn btn-primary">Leer más</a>
                        </div>
                    </div>
                </div>
            `;
        });

        $("#posts-container").html(postsHtml);
      })
      .catch((error) => {
        console.error("Error al cargar los datos:", error);
      });
  }

  // Verifica si estamos en blog.html
  if (window.location.pathname.includes("blog.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get("id"));

    fetch("/assets/data/posts.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la red");
        }
        return response.json();
      })
      .then((data) => {
        const posts = data.posts;
        const post = posts.find((p) => p.id === postId);

        if (post) {
          // Actualizar dinámicamente el título del documento
          $("title").text(post.titulo);

          // Rellenar el contenido del post
          $("#post-image").attr("src", post.url_imagen);
          $("#post-title").text(post.titulo);
          $("#post-category").text(`Categoría: ${post.categoria}`);
          $("#post-author-date").text(
            `Autor: ${post.autor} - Fecha: ${post.fecha}`
          );
          $("#post-content").html(post.contenido.replace(/\n/g, "<br>"));

          // Configurar los enlaces de navegación
          const previousPost = posts.find((p) => p.id === postId - 1);
          const nextPost = posts.find((p) => p.id === postId + 1);

          let navigationHtml = `
            <div class="d-flex justify-content-between mt-4">
              <a href="${
                previousPost ? `blog.html?id=${previousPost.id}` : "#"
              }" class="btn btn-link ${
            previousPost ? "" : "disabled"
          }">← Anterior</a>
              <a href="../index.html" class="btn btn-primary mb-4">Volver al inicio</a>
              <a href="${
                nextPost ? `blog.html?id=${nextPost.id}` : "#"
              }" class="btn btn-link ${
            nextPost ? "" : "disabled"
          }">Siguiente →</a>
            </div>
          `;
          $("#post").append(navigationHtml);
        } else {
          $("#post-content").text("Post no encontrado.");
        }
      })
      .catch((error) => {
        console.error("Error al cargar los datos:", error);
      });
  }
});
