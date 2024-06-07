<?php
    $route = [
        '/' => 'login',
        '/cargaison' => 'cargaison',
        '/produit' => 'produit',
    
    ];

    
    // require_once 'main.html.php';
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    

    if (array_key_exists($uri, $route)) {
        if ($route[$uri] != "login") {
            require_once 'api.php';
            require_once "template/partial/navbar.html.php";
            require "template/" . $route[$uri] . ".html.php";
        } else {
            require_once "template/" . $route[$uri] . ".html.php";
        }     
    }    
?>
