<?php
$filename = "subscore.txt";

if (array_key_exists('name', $_GET) && array_key_exists('score', $_GET) && 
    strlen(trim($_GET['name'])) && $_GET['score'] && is_writable($filename)) {

    $nm = (strlen($_GET['name'])>15) ? substr($_GET['name'],0,14) : $_GET['name'];
    if ($fh = fopen($filename, 'a+')) {
        fwrite($fh, trim($_GET['score'])."#-|-#".trim($nm)."\n");
        fclose($fh);
    }
}

if (file_exists($filename))
    readfile($filename);

?>