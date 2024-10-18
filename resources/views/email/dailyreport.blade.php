<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <style>
        body {
            direction: rtl;
        }

        .table {
            font-family: Arial, Helvetica, sans-serif;
            border-collapse: collapse;
            width: 100%;

        }

        .table td,
        .table th {
            border: 1px solid #ddd;
            padding: 8px;
        }

        .table tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        .table tr:hover {
            background-color: #ddd;
        }
    </style>

</head>

<body>
    <h3>تقرير يومي</h3>
    <table class="table">
        <tr>
            <td>إجمالي الأعمال المعلقة</td>
            <td>{{$data['workorder']['total_pending']}}</td>
        </tr>
        <tr>
            <td>تلقى اليوم الأعمال</td>
            <td>{{$data['workorder']['todays_received_works']}}</td>
        </tr>
        <tr>
            <td>اليوم تم الانتهاء من الأعمال</td>
            <td>{{$data['workorder']['today_despatched_works']}}</td>
        </tr>
    </table>

    <h3>مبيعات</h3>

    <table class="table">
        <tr>
            <td>المجموع الفرعي </td>
            <td>{{$data['sales']['sub_total']}}</td>
        </tr>
        <tr>
            <td>ضريبة </td>
            <td>{{$data['sales']['tax']}}</td>
        </tr>
        <tr>
            <td>المجموع </td>
            <td>{{$data['sales']['total']}}</td>
        </tr>
    </table>
    <br />

    <div style="background-color: #f7f3f2; height:20vh; padding: 7px;  text-align: center; ">
        <p>All Right reserved <a href="https://ahcjed.com">Al Hasib Computers</a> jeddha</p>
    </div>
</body>

</html>