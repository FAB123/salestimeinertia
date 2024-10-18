<?php

namespace App\Http\Controllers;

use App\Models\TodoList;
use App\Models\TodoTag;
use Carbon\Carbon;
use Illuminate\Http\Request;

class TodoListController extends Controller
{
    //get_accessory
    public function get_todo_tags()
    {
        $result = TodoTag::select('tag as name', 'tag_id as value')->get();
        return response()->json([
            'data' => $result,
        ], 200);
    }

    public function save_todo_tag(Request $request)
    {
        try {
            TodoTag::updateOrCreate(
                [
                    'tag_id' => $request->input('tag_id'),
                ],
                [
                    'tag' => $request->input('tag_name'),
                ]
            );

            return response()->json([
                'error' => false,
                'message' => "messages.new_item_saved",
            ], 200);
        } catch (\Exception $e) {
            info($e->getMessage());
            return response()->json([
                'error' => true,
                'message' => "messages.error_saving_new_item",
            ], 200);
        }
    }

    public function save_todo(Request $request)
    {
        try {
            $title = $request->input('title');
            $date = Carbon::parse($request->input('date'));
            $tags = $request->input('tags');
            $message = $request->input('description');
            // $todo_date = $date->setTimezone('Asia/Qatar')->format('Y-m-d');


            TodoList::updateOrCreate(
                [
                    'todo_id' => $request->input('todo_id'),
                ],
                [
                    'title' => $title,
                    'todo_date' => $date,
                    'tags' => $tags,
                    'message' => $message,
                ]
            );

            return response()->json([
                'error' => false,
                'message' => "messages.new_item_saved",
            ], 200);
        } catch (\Exception $e) {
            info($e->getMessage());
            return response()->json([
                'error' => true,
                'message' => "messages.error_saving_new_item",
            ], 200);
        }
    }

    public function get_todo_list($event, $type, $page, $size = 4)
    {
        try {
            $result = TodoList::when($event, function ($query) use ($event) {
                $today = Carbon::today();
                if ($event == "Today") {
                    $query->whereDate('todo_date',  $today);
                } else if ($event == "Upcoming") {
                    $query->whereDate('todo_date', ">", $today);
                } else if ($event == "Due") {
                    $query->whereDate('todo_date', "<", $today);
                } else {
                    $query->onlyTrashed();
                }
            })
                ->when($type, function ($query) use ($type) {
                    if ($type != "NONE") {
                        $query->whereJsonContains('tags', $type);
                    }
                })
                ->paginate($size, ['*'], 'page', $page);
            return response()->json([
                'status' => true,
                'data' => $result,
            ], 200);
        } catch (\Throwable $th) {
            info($th->getMessage());
            return response()->json([
                'status' => false,
            ], 200);
        }
    }

    public function done_todo($encrypted_todo_id)
    {
        try {
            $todo_id = decrypt($encrypted_todo_id);
            TodoList::updateOrCreate(
                [
                    'todo_id' => $todo_id,
                ],
                [
                    'done' => 1,
                ]
            );
            return response()->json([
                'status' => true,
                'message' => 'messages.todo_marked_done',
            ], 200);
        } catch (\Throwable $th) {
            info($th->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'messages.error_saving_new_item',
            ], 200);
        }
    }

    public function delete_todo($encrypted_todo_id)
    {
        try {
            $todo_id = decrypt($encrypted_todo_id);
            TodoList::find($todo_id)->delete();

            return response()->json([
                'status' => true,
                'message' => 'messages.todo_marked_done',
            ], 200);
        } catch (\Throwable $th) {
            info($th->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'messages.error_saving_new_item',
            ], 200);
        }
    }

    public function get_todo_by_id($encrypted_todo_id)
    {
        try {
            $todo_id = decrypt($encrypted_todo_id);
            $data = TodoList::select('todo_id', 'title', 'todo_date as date', 'tags', 'message as description')->find($todo_id);
            return response()->json([
                'status' => true,
                'data' => $data,
            ], 200);
        } catch (\Throwable $th) {
            info($th->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'messages.error_saving_new_item',
            ], 200);
        }
    }
}
