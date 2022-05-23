<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

class ImageMakerController extends AbstractController
{
    /**
     * @Route("#########", name="image_maker", methods={"GET","POST"})
     */
    public function ImageMakerFunc(Request $request): BinaryFileResponse
    {
        $imageString = $request->getContent();

        if ( $imageString )
        {
            $imgDecode = json_decode($imageString, true);

            if ( count($imgDecode) == 900)
            {
                $img = imagecreatetruecolor(30, 30);
                $finalImg = imagecreatetruecolor(300, 300);
    
                foreach ($imgDecode as $item) {
                    $col = $this->convertHexColorToRGBcolor($item[2], $img);
                    imagesetpixel($img, $item[0], $item[1], $col);
                    imagecolordeallocate($img, $col);
                }

                imagecopyresized($finalImg, $img, 0, 0, 0, 0, 300, 300, 30, 30);
    
                header('Content-type: image/png');
                $fileName = uniqid() . '.png';
                $directory = $this->getParameter('generate_directory') . $fileName;
    
                if ( imagepng($finalImg, $directory) )
                {
                    $result = $fileName . ' is generate.';
                }
                else
                {
                    $result = 'A error occured during generating image.';
                }

                imagedestroy($finalImg);
                imagedestroy($img);
            }

        }
        
        $response = new BinaryFileResponse($directory);
        $response->headers->set('Content-type', 'image/png');
        //$response = new JsonResponse($path);
        return $response;
    }

    

    public function convertHexColorToRGBcolor(string $hexColor, $img){

        list($r, $g, $b) = sscanf($hexColor, "#%02x%02x%02x");
        $col = imageColorAllocate($img, $r, $g, $b);
        return $col;
    }
}
