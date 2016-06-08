<?php

class SwarmUploader
{
    public $url = 'http://localhost:8500';

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
        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory), RecursiveIteratorIterator::SELF_FIRST);
        foreach ($files as $item) {
            $hash = $this->uploadFile($item);
            $data = [
                'entries' => [
                    [
                        'hash' => $hash,
                        'contentType' => 'text/plain',
                        'path' => '',
                    ],
                ],
            ];

            $json = json_encode($data);
            $hash = $this->uploadText($json);
        }
    }
}