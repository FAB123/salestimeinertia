<?php

namespace App\Models\Workorders;

use App\Models\Customer\Customer;
use App\Models\Employee\Employee;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Workorder extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $primaryKey = 'workorder_id';

    public function customer()
    {
        return $this->hasOne(Customer::class, 'customer_id', 'customer_id');
    }

    public function status()
    {
        return $this->hasOne(WorkorderStatus::class,  'id', 'workorder_status');
    }

    public function employee()
    {
        return $this->hasOne(Employee::class, 'employee_id', 'employee_id');
    }

    public function details()
    {
        return $this->hasMany(WorkorderUpdate::class, 'workorder_id', 'workorder_id');
    }

    public function getTransactionTimeAttribute()
    {
        return $this->created_at->format('d-m-Y h:i:A');
    }

    protected $appends = ['transaction_time'];
}
