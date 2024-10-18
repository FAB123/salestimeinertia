<?php

namespace App\Models\Purchase;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $primaryKey = 'purchase_id';

    protected function PurchaseDate(): Attribute
    {
        return Attribute::make(
            get: fn(string $value) => Carbon::parse($value)->format('d-m-Y'),
            set: fn(string $value) => Carbon::parse($value)->format('Y-m-d'),
        );
    }
}
