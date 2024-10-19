<?php

use App\Models\Configurations\Configuration;


if (!function_exists('get_activation_code')) {
    function get_activation_code()
    {
        $address = str_replace("(", "", str_replace(")", "", GetVolumeLabel("c")));
        $address = base64_encode($address);
        $address = preg_replace("/[^a-zA-Z0-9]/", "", $address);
        return $address;
    }
}
function GetVolumeLabel($drive)
{
    if (preg_match(
        '#Volume Serial Number is (.*)\n#i',
        shell_exec('dir ' . $drive . ':'),
        $m
    )) {
        $volname = ' (' . $m[1] . ')';
    } else {
        $volname = 'freeforce';
    }
    return $volname;
}

if (!function_exists('validateAppStatus')) {
    function validateAppStatus()
    {
        $config_data = Configuration::get();

        // Check if version data exists for activation
        $version_data = $config_data->find('version_data');

        if ($version_data) {
            $reg_key = get_activation_code();
            if (md5($reg_key) != $version_data->value) {
                return false;
            }
            return 'Activated';
        }

        // Check for trial version info
        $version_info = $config_data->find('version_info');
        if ($version_info) {
            $datediff = check_version();
            if ($datediff > 0) {
                return strval($datediff);
            }
            return false;
        }

        // If no version_info exists, create trial version
        Configuration::updateOrCreate([
            'key' => 'version_info',
            'value' => base64_encode(time()),
        ]);
        return strval(check_version());
    }
}


if (!function_exists('activateApp')) {
    function activateApp($key_file)
    {
        $reg_key = get_activation_code();
        if (md5($reg_key) != $key_file) {
            return false;
        } else {
            Configuration::updateOrCreate(
                [
                    'key' => 'version_data'
                ],
                [
                    'value' => $key_file
                ]
            );
            return 'Activated';
        }
    }
}

function check_version()
{
    $now = time();
    $version_time = Configuration::find('version_info')->value;
    $version_time = base64_decode($version_time);
    $datediff = $now - $version_time;
    $datediff = round($datediff / (60 * 60 * 24));
    return 15 - $datediff;
}
