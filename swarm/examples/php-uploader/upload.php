<?php

include_once 'SwarmUploader.php';
$uploader = new SwarmUploader();

if (!isset($argv[1])) {
    echo 'First argument must be application path';
    return;
}

$path = $argv[1];
$hash = $uploader->uploadDirectory($path);
echo "Application uploaded!\r\n";
echo "Open this url in browser:\r\n";
echo $uploader->getUrlByHash($hash) . "\r\n";
