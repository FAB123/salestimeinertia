<?php

namespace App\Http\Middleware;

use App\Models\Configurations\Configuration;
use App\Models\Configurations\InvoiceTemplate;
use App\Models\Configurations\StockLocation;
use App\Models\Configurations\TaxScheme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        return array_merge(parent::share($request), [
            'appName' => config('app.name'),
            'configurationData' => fn () => $user ? Configuration::all()->map(function ($item) {
                return [$item['key'] => $item['value']];
            })->flatMap(function ($item) {
                return $item;
            })->all() : null,
            "invoiceTemplate" => fn () => $user ? InvoiceTemplate::all() : null,
            "taxScheme" => fn () => $user ? TaxScheme::all() : null,
            "companyLogo" => function () use ($user) {
                if ($user) {
                    $company_logo = Configuration::find('company_logo');
                    return $company_logo->value != '0' ? base64_encode(Storage::disk('public')->get("company_logo/$company_logo->value")) : null;
                } else {
                    return null;
                }
            },
            "storeID" => fn () => $request->session()->get('store'),
            "storeData" => fn () => $user ? StockLocation::find($request->session()->get('store')) : null,
            'auth.user' => fn () => $request->user()
                ? $request->user()->only('id', 'name', 'email')
                : null,
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
            ],
            // 'user.roles' => $request->user() ? $request->user()->roles->pluck('name') : [],
            'auth.permissions' => fn () => $user ? $request->user()->getPermissionNames() : [],
            'urlPrevious' => url()->previous(),
        ]);
    }
}
