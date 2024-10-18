<?php

namespace App\Console\Commands;

use App\Mail\DailyReport;
use App\Models\Sales\Sale;
use App\Models\Workorders\Workorder;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendReport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-report';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send Report as Email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Begin get Reports...");
        $date = Carbon::yesterday();

        $this->info("Fetching data from database...");
        $total_pending = Workorder::where('workorder_status', "!=", 4)->count();
        $todays_received_works = Workorder::whereDate('created_at', $date)->count();
        $today_despatched_works = Workorder::where('workorder_status', 4)
            ->whereDate('updated_at', $date)
            ->count();

        $sales = Sale::whereDate('created_at', $date)->get();

        $sub_total = $sales->sum('sub_total');
        $tax = $sales->sum('tax');
        $total = $sales->sum('total');

        $data = [
            'workorder' =>
            ['total_pending' => $total_pending, 'todays_received_works' => $todays_received_works, 'today_despatched_works' => $today_despatched_works],
            'sales' => [
                'sub_total' => $sub_total, 'tax' => $tax, 'total' => $total
            ]
        ];

        $this->info("Sending Email...");
        info($data);
        Mail::to('fysalkt@gmail.com')->send(new DailyReport($data));

        $this->info("Sending report compleeted...");
    }
}
