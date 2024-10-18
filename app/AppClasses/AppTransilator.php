<?php

namespace App\AppClasses;

class AppTransilator
{
    private $rootDirectory;

    /** @var array<string> */
    private $en2arPregSearch = array();

    /** @var array<string> */
    private $en2arPregReplace = array();


    /** @var array<string> */
    private $en2arStrSearch = array();

    /** @var array<string> */
    private $en2arStrReplace = array();

    /** @var array<string> */
    private $ar2enPregSearch = array();

    /** @var array<string> */
    private $ar2enPregReplace = array();

    /** @var array<string> */
    private $ar2enStrSearch = array();

    /** @var array<string> */
    private $ar2enStrReplace = array();

    /** @var array<string> */
    private $iso233Search = array();

    /** @var array<string> */
    private $iso233Replace = array();

    /** @var array<string> */
    private $rjgcSearch = array();

    /** @var array<string> */
    private $rjgcReplace = array();

    /** @var array<string> */
    private $diariticalSearch = array();

    /** @var array<string> */
    private $diariticalReplace = array();

    /** @var array<string> */
    private $sesSearch = array();

    /** @var array<string> */
    private $sesReplace = array();


    public function __construct()
    {
        mb_internal_encoding('UTF-8');
        $this->rootDirectory = dirname(__FILE__);
        $this->arTransliterateInit();
    }

    private function arTransliterateInit()
    {
        $json = json_decode((string)file_get_contents($this->rootDirectory . '/data/ar_transliteration.json'), true);

        foreach ($json['preg_replace_en2ar'] as $item) {
            $this->en2arPregSearch[]  = $item['search'];
            $this->en2arPregReplace[] = $item['replace'];
        }

        foreach ($json['str_replace_en2ar'] as $item) {
            $this->en2arStrSearch[]  = $item['search'];
            $this->en2arStrReplace[] = $item['replace'];
        }

        foreach ($json['preg_replace_ar2en'] as $item) {
            $this->ar2enPregSearch[]  = $item['search'];
            $this->ar2enPregReplace[] = $item['replace'];
        }

        foreach ($json['str_replace_ar2en'] as $item) {
            $this->ar2enStrSearch[]  = $item['search'];
            $this->ar2enStrReplace[] = $item['replace'];
        }

        foreach ($json['str_replace_diaritical'] as $item) {
            $this->diariticalSearch[]  = $item['search'];
            $this->diariticalReplace[] = $item['replace'];
        }

        foreach ($json['str_replace_RJGC'] as $item) {
            $this->rjgcSearch[]  = $item['search'];
            $this->rjgcReplace[] = $item['replace'];
        }

        foreach ($json['str_replace_SES'] as $item) {
            $this->sesSearch[]  = $item['search'];
            $this->sesReplace[] = $item['replace'];
        }

        foreach ($json['str_replace_ISO233'] as $item) {
            $this->iso233Search[]  = $item['search'];
            $this->iso233Replace[] = $item['replace'];
        }
    }

    public function en2ar($string, $locale = 'en_US')
    {
        setlocale(LC_ALL, $locale);

        $string = iconv("UTF-8", "ASCII//TRANSLIT", $string);
        $string = preg_replace('/[^\w\s]/', '', $string);
        $string = strtolower($string);
        $words  = explode(' ', $string);
        $string = '';

        foreach ($words as $word) {
            // if it is el or al don't add space after
            if ($word == 'el' || $word == 'al') {
                $space = '';
            } else {
                $space = ' ';
            }

            // skip translation if it has no a-z char (i.e., just add it to the string as is)
            if (preg_match('/[a-z]/i', $word)) {
                $word = preg_replace($this->en2arPregSearch, $this->en2arPregReplace, $word);
                $word = strtr($word, array_combine($this->en2arStrSearch, $this->en2arStrReplace));
            }

            $string .= $word . $space;
        }

        return trim($string);
    }
}
