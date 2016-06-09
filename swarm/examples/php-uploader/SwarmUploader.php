<?php

class SwarmUploader
{
    //public $url = 'http://localhost:8500';
    public $url = 'http://swarm-gateways.net';
    public $indexFile = 'index.html';

    public function uploadText($text)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->url . '/bzzr:/');
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $text);
        $result = curl_exec($ch);
        curl_close($ch);

        return $result;
    }

    public function uploadFile($filePath)
    {
        $text = file_get_contents($filePath);

        return $this->uploadText($text);
    }

    public function uploadDirectoryInfo($directory)
    {
        $this->uploadText(json_encode([
            'entries' => [
                [
                    'hash' => '',
                    'contentType' => '',
                    'path' => $directory,
                ]
            ],
        ]));
    }

    public function getMimeType($fileName)
    {
        $info = pathinfo($fileName);
        $extension = $info['extension'];
        if ($extension == 'css') {
            return 'text/css';
        }

        $finfo = new finfo(FILEINFO_MIME);
        $result = $finfo->file($fileName);
        $exploded = explode(';', $result);

        return $exploded[0];
    }

    public function getUrlByHash($hash)
    {
        return $this->url . '/bzz:/' . $hash . '/';
    }

    public function uploadDirectory($directory)
    {
        $directory = realpath($directory) . DIRECTORY_SEPARATOR;
        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory), RecursiveIteratorIterator::SELF_FIRST);

        $entries = [];
        foreach ($files as $item) {
            if (in_array(basename($item), ['.', '..']) || is_dir($item)) {
                continue;
            }

            $mime = $this->getMimeType($item);
            $hash = $this->uploadFile($item);
            $item = str_replace($directory, '', $item);
            if ($item == $this->indexFile) {
                $item = '';
            }

            $entry = [
                'hash' => $hash,
                'contentType' => $mime,
                'path' => str_replace('\\', '/', $item),
            ];
            $entry['hash'] = $hash;
            $entries[] = $entry;
        }

        return $this->uploadText(json_encode([
            'entries' => $entries,
        ]));
    }
}