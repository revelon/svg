<?php

$filename = "score.txt";

if (array_key_exists('name', $_GET) && array_key_exists('score', $_GET) && 
    strlen(trim($_GET['name'])) && $_GET['score'] && is_writable($filename)) {

    if ($fh = fopen($filename, 'a+')) {
        fwrite($fh, trim($_GET['score'])."#-|-#".trim($_GET['name'])."\n");
        fclose($fh);
    }
}

if (file_exists($filename))
    readfile($filename);

?>