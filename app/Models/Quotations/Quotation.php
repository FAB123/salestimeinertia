<?php

namespace App\Models\Quotations;

use App\Models\Customer\Customer;
use App\Models\Employee\Employee;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quotation extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $primaryKey = 'quotation_id';

    public function customer()
    {
        return $this->hasOne(Customer::class, 'customer_id', 'customer_id');
    }

    public function employee()
    {
        return $this->hasOne(Employee::class, 'employee_id', 'employee_id');
    }

    public function getTransactionTimeAttribute()
    {
        return $this->created_at->format('d-m-Y h:i:A');
    }

    protected $appends = ['transaction_time'];
}
