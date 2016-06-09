<?php

class SwarmUploader
{
    //public $url = 'http://localhost:8500';
    public $url = 'http://swarm-gateways.net';

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

    public function uploadDirectory($directory)
    {
        $directory = realpath($directory) . DIRECTORY_SEPARATOR;
        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory), RecursiveIteratorIterator::SELF_FIRST);

        $entries = [];
        foreach ($files as $item) {
            if (in_array(basename($item), ['.', '..']) || is_dir($item)) {
                continue;
            }

            $item = str_replace($directory, '', $item);
            $hash = $this->uploadFile($item);

            $entry = [
                'hash' => $hash,
                'contentType' => 'text/plain',
                'path' => str_replace('\\', '/', $item),
            ];
            $data = [
                'entries' => [$entry],
            ];

            $json = json_encode($data);
            $hash = $this->uploadText($json);
            $entry['hash'] = $hash;
            $entries[] = $entry;
            echo $entry['path'] . "\r\n";
            echo $hash . "\r\n";
        }

        echo "So, result\r\n";
        echo $this->uploadText(json_encode([
            'entries' => $entries,
        ]));
    }
}