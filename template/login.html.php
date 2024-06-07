<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"> -->
    <link rel="stylesheet" href="./dist/css/style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">

    <link href="https://cdn.jsdelivr.net/npm/daisyui@4.11.1/dist/full.min.css" rel="stylesheet" type="text/css" />
    <!-- <script src="https://cdn.tailwindcss.com"></script> -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/css/adminlte.min.css">
    <title>Document</title>
    <link rel="stylesheet" href="./dist/css/style.css">
    <style>
       
    </style>
</head>

<body>
    
<div class="login-box mx-32 flex">
    <div class="card w-96">
        <div class="card-body login-card-body">
            <p class="login-box-msg">Sign in to start your session</p>
            <form action="./cargaison" method="post">
                <div class="input-group mb-3">
                    <input type="email" class="form-control" placeholder="Email">
                    <div class="input-group-append">
                        <div class="input-group-text">
                            <span class="fas fa-envelope"></span>
                        </div>
                    </div>
                </div>
                <div class="input-group mb-3">
                    <input type="password" class="form-control" placeholder="Password">
                    <div class="input-group-append">
                        <div class="input-group-text">
                            <span class="fas fa-lock"></span>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-8">
                        <div class="icheck-primary">
                            <input type="checkbox" id="remember">
                            <label for="remember">
                                Remember Me
                            </label>
                        </div>
                    </div>

                    <div class="col-4">
                        <button type="submit" class="btn btn-primary btn-block">Sign In</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="ml-12">
        <label>Rechercher Etat Avancement Produit</label>
        <input type="text" id="search-product-id" class="form-control" placeholder="Rechercher...">
        <button id="search-product-btn" class="btn btn-primary">Rechercher</button>
        <div id="search-result" class="mt-4 p-4 border border-gray-300 rounded"></div>
    </div>
</div>
<script defer>
document.getElementById('search-product-btn').addEventListener('click', function() {
    const productId = document.getElementById('search-product-id').value.trim();
    const resultDiv = document.getElementById('search-result');

    if (productId === "") {
        resultDiv.innerHTML = "Veuillez entrer un ID de produit.";
        return;
    }

    fetch(`search_product.php?idproduit=${productId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                resultDiv.innerHTML = `État d'avancement du produit (ID: ${productId}): ${data.etat_avancement}`;
            } else {
                resultDiv.innerHTML = data.message;
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            resultDiv.innerHTML = "Une erreur est survenue lors de la recherche.";
        });
});

</script>
</body>

</html>