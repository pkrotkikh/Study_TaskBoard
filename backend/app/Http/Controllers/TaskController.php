<?php
namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'project_id'=>'required|exists:projects,id',
            'title'=>'required|string',
            'description'=>'nullable|string',
            'status'=>'required|string',
            'order'=>'nullable|integer'
        ]);
        $task = Task::create($data);
        return response()->json($task, 201);
    }

    public function update(Request $request, Task $task)
    {
        $data = $request->validate([
            'title'=>'sometimes|required|string',
            'description'=>'nullable|string',
            'status'=>'sometimes|required|string',
            'order'=>'nullable|integer'
        ]);
        $task->update($data);
        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(null, 204);
    }
}
