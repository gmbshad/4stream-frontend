
function render(description) {
  return `
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="${description}">
        <meta name="yandex-verification" content="82ba418fd789a9b6" />
        <!-- Favicon -->
        <link rel="icon" type="image/png" href="/resources/images/favicon.png">
        <link rel="stylesheet" href="/unify.css" charset="utf-8">
        <!-- Web Fonts -->
        <link rel='stylesheet' type='text/css' href='//fonts.googleapis.com/css?family=Open+Sans:400,300,600&amp;subset=cyrillic,latin'>
    `;
}

export {render};
