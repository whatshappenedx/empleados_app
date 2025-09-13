<?php
declare(strict_types=1);

namespace App\Core;

class Router
{
    private array $routes = [];

    public function get(string $path, $handler): void { $this->add('GET', $path, $handler); }
    public function post(string $path, $handler): void { $this->add('POST', $path, $handler); }
    public function put(string $path, $handler): void { $this->add('PUT', $path, $handler); }
    public function delete(string $path, $handler): void { $this->add('DELETE', $path, $handler); }

    private function add(string $method, string $path, $handler): void
    {
        $this->routes[] = compact('method', 'path', 'handler');
    }

    public function dispatch(): void
    {
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) continue;
            $params = [];
            if ($this->match($route['path'], $uri, $params)) {
                $this->invoke($route['handler'], $params);
                return;
            }
        }

        Response::error('Not Found', 404);
    }

    private function match(string $routePath, string $uri, array &$params): bool
    {
        $pattern = preg_replace('#\{([a-zA-Z_][a-zA-Z0-9_]*)\}#', '(?P<$1>[^/]+)', $routePath);
        $pattern = '#^' . rtrim($pattern, '/') . '/?$#';
        if (preg_match($pattern, $uri, $matches)) {
            foreach ($matches as $key => $value) {
                if (!is_int($key)) $params[$key] = $value;
            }
            return true;
        }
        return false;
    }

    private function invoke($handler, array $params): void
    {
        if (is_callable($handler)) {
            $handler($params);
            return;
        }
        if (is_string($handler) && strpos($handler, '@') !== false) {
            [$controller, $method] = explode('@', $handler, 2);
            $class = 'App\\Controllers\\' . $controller;
            if (!class_exists($class)) {
                Response::error('Controller not found', 500);
                return;
            }
            $obj = new $class();
            if (!method_exists($obj, $method)) {
                Response::error('Method not found', 500);
                return;
            }
            $obj->$method($params);
            return;
        }
        Response::error('Invalid route handler', 500);
        return;
    }
}

