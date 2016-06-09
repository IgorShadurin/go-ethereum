<?php

include_once 'SwarmUploader.php';
$uploader = new SwarmUploader();

if (!isset($argv[1])) {
    echo 'First argument must be application path';
    return;
}

$path = $argv[1];
echo $uploader->uploadDirectory($path);
